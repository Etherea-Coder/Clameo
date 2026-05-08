import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const BUCKET = "case-attachments";

serve(async (req) => {
  // Only allow POST requests (though we might call it via cron)
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Configuration server incomplète." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // 1. Calculate the cutoff date (Exactly 7 days ago)
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 7);
  const cutoffIso = cutoffDate.toISOString();

  console.log(`Starting cleanup for sessions created before: ${cutoffIso}`);

  // 2. Fetch sessions older than 7 days
  const { data: expiredSessions, error: sessionsError } = await supabase
    .from("case_sessions")
    .select("id")
    .lt("created_at", cutoffIso);

  if (sessionsError) {
    console.error("Error fetching expired sessions:", sessionsError);
    return new Response(JSON.stringify({ error: sessionsError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!expiredSessions || expiredSessions.length === 0) {
    return new Response(JSON.stringify({ message: "No expired sessions found.", deleted: 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sessionIds = expiredSessions.map(s => s.id);
  console.log(`Found ${sessionIds.length} expired sessions.`);

  let totalFilesDeleted = 0;
  let totalAttachmentsDeleted = 0;
  let totalSessionsDeleted = 0;

  // Process sessions in batches or one by one to handle storage deletion first
  for (const sessionId of sessionIds) {
    // 3. Get attachments for this session to delete storage files
    const { data: attachments, error: attachmentsFetchError } = await supabase
      .from("case_attachments")
      .select("id, file_path")
      .eq("case_session_id", sessionId);

    if (attachmentsFetchError) {
      console.error(`Error fetching attachments for session ${sessionId}:`, attachmentsFetchError);
      continue;
    }

    let storageSuccess = true;

    if (attachments && attachments.length > 0) {
      const filePaths = attachments.map(a => a.file_path);
      
      // 4. Delete files from Storage first (as requested)
      const { data: deletedFiles, error: storageError } = await supabase.storage
        .from(BUCKET)
        .remove(filePaths);

      if (storageError) {
        console.error(`Error deleting files for session ${sessionId}:`, storageError);
        storageSuccess = false;
      } else if (deletedFiles) {
        totalFilesDeleted += deletedFiles.length;
      }

      if (storageSuccess) {
        // 5. Delete rows from case_attachments
        const { count: deletedRows, error: attachmentsDeleteError } = await supabase
          .from("case_attachments")
          .delete()
          .eq("case_session_id", sessionId);

        if (attachmentsDeleteError) {
          console.error(`Error deleting attachment rows for session ${sessionId}:`, attachmentsDeleteError);
        } else {
          totalAttachmentsDeleted += (deletedRows || attachments.length);
        }
      }
    }

    if (storageSuccess) {
      // 6. Delete the session row itself
      const { error: sessionDeleteError } = await supabase
        .from("case_sessions")
        .delete()
        .eq("id", sessionId);

      if (sessionDeleteError) {
        console.error(`Error deleting session ${sessionId}:`, sessionDeleteError);
      } else {
        totalSessionsDeleted++;
      }
    }
  }

  const result = {
    message: "Cleanup completed successfully.",
    sessionsFound: sessionIds.length,
    sessionsDeleted: totalSessionsDeleted,
    attachmentsDeleted: totalAttachmentsDeleted,
    storageFilesDeleted: totalFilesDeleted
  };

  console.log("Cleanup result:", result);

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
