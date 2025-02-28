const PostModel = `
  model Post {
    id        Int      @id @default(autoincrement())
    name     String   @unique
    description  String
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }
`;

export default PostModel;
