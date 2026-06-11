export const PERSISTENCE_NAMESPACE = "k12-learning-app";
export const PERSISTENCE_VERSION = "v7";

export function buildStudentPersistenceKey(studentId: string): string {
  return `${PERSISTENCE_NAMESPACE}:${PERSISTENCE_VERSION}:student:${studentId}:learning-state`;
}
