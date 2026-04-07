import  conf  from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";

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
this.login({email,password});
}
else{
 return userAccount;
}
    }catch(error){
       throw error;
    }
}

async login({email,password}){
try{
 return await this.account.createEmailPasswordSession(email, password);
}
catch(error)
{
    throw error;  
  }
 }

async currentUser(){
try{
  return await this.account.get();
}
catch(error)
{
    console.log("Appwrite service :: getCurrentUser :: error", error);
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