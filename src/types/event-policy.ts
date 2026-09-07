export type EventPolicyContent = {
  effectiveDate: string;
  introduction: string;
  sections: Array<{ title: string; body: string[] }>;
};
