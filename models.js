import mongoose from 'mongoose';

let models = {};

main().catch(err => console.log(err))
async function main(){
    console.log('connecting to mongodb')
    
    await mongoose.connect('mongodb+srv://group5:group5_finalproject@group5.ywvlpkc.mongodb.net/?retryWrites=true&w=majority')

    console.log('succesffully connected to mongodb!')

    const userSchema = new mongoose.Schema({
        name: String,
        username: String,
        email: String,
        myBookmarks: [String]
    })
    models.User = mongoose.model('User', userSchema)

    const postSchema = new mongoose.Schema({
        username: String,
        name: String,
        contact: String,
        housing: String,
        zipcode: String,
        address: String,
        description: String,
        price: String,
        created_date: Date, 
        bookmarks: [String]
    })
    models.Post = mongoose.model('Post', postSchema)

    const commentSchema = new mongoose.Schema({
        username: String,
        created_date: Date,
        comment: String,
        post: {type: mongoose.Schema.Types.ObjectId, ref: "Post"}
     })
    models.Comment= mongoose.model('Comment', commentSchema)

    console.log('mongoose models created') 
}

export default models;