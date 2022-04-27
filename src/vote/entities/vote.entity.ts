export class Vote {
  idgroup: string;
  timeout: Date;
  header: string;
  owner: string;
  select: Array<string>;
  score: Array<number>;
  voted: Array<string>;
  open: boolean;
}
