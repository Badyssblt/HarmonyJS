const UserModel = `
  model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    password  String
    firstname      String?
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }
`;

export default UserModel;
