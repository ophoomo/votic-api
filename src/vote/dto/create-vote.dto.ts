export class CreateVoteDto {
  idgroup: string;
  timeout: Date;
  header: string;
  select: Array<string>;
}
