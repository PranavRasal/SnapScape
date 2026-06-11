import  conf  from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";

function isPausedProjectError(error) {
  const message = error?.message || "";
  return error?.code === 403 && message.includes("Project is paused due to inactivity");
}

function pausedProjectMessage() {
  return "Appwrite project is paused due to inactivity. Restore it from the Appwrite console, then try again.";
}

export class AuthService{
     client = new Client();
     account;
constructor(){
        this.client
        .setEndpoint(conf.appwriteURL)
        .setProject(conf.appwriteProjectID);
        this.account = new Account(this.client);
}

async createAccount({email,password,name}){ // create account with email and password and it not chnage if backend want to change 
 try{
const userAccount =  await this.account.create(ID.unique(), email, password, name);
if(userAccount){
 // Account login after account creation
 await this.login({email,password});
 return userAccount;
}
else{
 return userAccount;
}
    }catch(error){
     if (isPausedProjectError(error)) {
    throw new Error(pausedProjectMessage());
     }
       throw error;
    }
}

async login({email,password}){
try{
 return await this.account.createEmailPasswordSession(email, password);
}
catch(error)
{
    if (isPausedProjectError(error)) {
      throw new Error(pausedProjectMessage());
    }
    throw error;  
  }
 }

async currentUser(){
try{
  return await this.account.get();
}
catch(error)
{
    if (isPausedProjectError(error)) {
      console.warn("Appwrite service :: getCurrentUser ::", pausedProjectMessage());
      return null;
    }
    return null;
  }
}

async logout(){
    try {
        await this.account.deleteSessions();
    } catch (error) {
        throw error;
    }
}


}


const authService = new AuthService();
export default  authService;