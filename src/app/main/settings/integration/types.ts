export type FileMapAndValidateResult = {
  errors: string[];
  success: number;
  fails: number;
};

export type KeyDefinition = { id: string; description: string; key: string; claims: string[] };
