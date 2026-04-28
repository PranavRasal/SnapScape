import  conf  from "../conf/conf.js";
import { Client, ID , Databases , Query , Storage } from "appwrite";

export class Service{
client = new Client();
database;
bucket;

constructor(){
    this.client
    .setEndpoint(conf.appwriteURL)
    .setProject(conf.appwriteProjectID);
    this.database = new Databases(this.client);
    this.bucket = new Storage(this.client);
}

async createpost({title , slug , content , featureImage , status , userId}){ // create post with all necessary fields
try {
    const contentSnippet = (content && typeof content === 'string') ? content.substring(0, 255) : '';
    return await this.database.createDocument(
        conf.appwriteDatabaseID,
        conf.appwriteTableID,
        slug,
        {
        title,
        content: contentSnippet,
        image: featureImage,
        status,
        userID: userId
        }
    )
} 
catch (error) 
{
    console.log(error);
}
}

async updatepost(slug,{title , content , featureImage , status }){ // update post with all necessary fields
try {
    const contentSnippet = (content && typeof content === 'string') ? content.substring(0, 255) : '';
    return await this.database.updateDocument(
        conf.appwriteDatabaseID,
        conf.appwriteTableID,
        slug,
        {
            title,
            content: contentSnippet,
            image: featureImage,
            status
            }
    );
} catch (error) {
    console.log(error);
}
}

async deletepost(slug){ // delete post by slug
try {
     await this.database.deleteDocument(
        conf.appwriteDatabaseID,
        conf.appwriteTableID,
        slug
    );
    return true;
} catch (error) {
    console.log(error);
    return false;
}
}

async getpost(slug){ // get post by slug
try {
    return await this.database.getDocument(
        conf.appwriteDatabaseID,
        conf.appwriteTableID,
        slug
    )
} catch (error) {
    console.log(error);
    return false;
}
}

async getposts(queries = [Query.equal("status", "active")]){ // get all posts
try {
    return await this.database.listDocuments(
        conf.appwriteDatabaseID,
        conf.appwriteTableID,
        queries
    )
} catch (error) {
    console.log(error);
    return false;
}
}

// upload file
async uploadfile(file){
try {
    return await this.bucket.createFile(
        conf.appwriteBucketID,
        ID.unique(),
        file
        )
} catch (error) {
    console.log("error in appwrite ",error);
    return false;
}
}

// delete file
async deletefile(fileID){
try {
     await this.bucket.deleteFile(
        conf.appwriteBucketID,
        fileID
    ); 
    return true;
} catch (error) {
    console.log("error in appwrite ",error);
    return false;
}
}

// get file preview
getFilePreview(fileID){
    try {
        if (!fileID || fileID.trim() === '') {
            console.warn('⚠ Empty fileID provided to getFilePreview');
            return null;
        }
        // Construct URL manually to ensure proper formatting
        const url = `${conf.appwriteURL}/storage/buckets/${conf.appwriteBucketID}/files/${fileID}/view?project=${conf.appwriteProjectID}`;
        console.log('✓ Preview URL created for:', fileID, 'URL:', url);
        return url;
    } catch (error) {
        console.error('✗ Error getting file preview for:', fileID, error);
        return null;
    }
}

// CamelCase aliases for consistency
getPost(slug) {
    return this.getpost(slug);
}

deletePost(slug) {
    return this.deletepost(slug);
}

deleteFile(fileID) {
    return this.deletefile(fileID);
}

}
const service = new Service();
export default service