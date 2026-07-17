function csvSafeValue(value = "") {
  const raw = String(value ?? "");
  const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return /[",\r\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}

export function formatSchoolReportCsv(report = {}) {
  const headers = [
    "school_id",
    "class_id",
    "class_name",
    "grade",
    "academy_id",
    "subject",
    "teacher_id",
    "roster_count",
    "average_mastery",
    "needs_help",
    "teacher_support",
    "submitted_artifacts",
    "group_missions",
    "session_status"
  ];
  const rows = (report.rows || []).map((row) =>
    [
      row.schoolId,
      row.classId,
      row.className,
      row.grade,
      row.academyId,
      row.subject,
      row.teacherId,
      row.rosterCount,
      row.averageMastery,
      row.needsHelp,
      row.teacherSupport,
      row.submittedArtifacts,
      row.groupMissions,
      row.sessionStatus
    ]
      .map(csvSafeValue)
      .join(",")
  );
  return [headers.map(csvSafeValue).join(","), ...rows].join("\r\n") + "\r\n";
}
