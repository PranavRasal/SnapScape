const conf={
appwriteURL : String(import.meta.env.VITE_APPWRITE_URL),
appwriteProjectID : String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
appwriteDatabaseID : String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
appwriteTableID : String(import.meta.env.VITE_APPWRITE_TABLE_ID),
appwriteBucketID : String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
tinyMCEAPIKey : String(import.meta.env.VITE_TINYMCE_API_KEY || '')
}
export default conf;