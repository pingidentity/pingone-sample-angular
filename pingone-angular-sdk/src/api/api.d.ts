
export declare class ApiClient {
  constructor(config: any);
  addUser(email: string, username: string, populationId: string): Promise<any>;
  deleteUser(userId: string): Promise<any>;
  findUser(userName: string): Promise<any>;
  getPopulations(): Promise<any>;
  updateUser(userId: string, firstName: string, lastName: string): Promise<any>;
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<any>;
  setPassword(userId: string, password: string, forceChange?: boolean): Promise<any>;
  sendRecoveryCode(userId: string): Promise<any>;
  recoverPassword(userId: string, recoveryCode: string, newPassword: string): Promise<any>;
  getPasswordPattern(): Promise<any>;
}
