async function init(){
    await loadIdentity();
    loadPosts();
}

// loads posts
async function loadPosts(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    if (username==myIdentity) {
        document.getElementById("new_post").classList.add("d-none");
    } else {
        document.getElementById("new_post").classList.remove("d-none");
    }

    document.getElementById("posts_box").innerText = "Loading...";

    let postsJson = await fetchJSON(`api/${apiVersion}/posts`)
    
    let postsHtml = postsJson.map(postInfo => {
        // inlcluded user name
        return `<div class="post">
                    <strong>Name:</strong><a href="/userAccount.html?user=${encodeURIComponent(postInfo.username)}">${escapeHTML(postInfo.name)}</a>
                    <strong>Contact Information:</strong> ${postInfo.contact} <br>
                    <strong>Housing Name:</strong> ${postInfo.housing} <br>
                    <strong>Zipcode:</strong> ${postInfo.zipcode} <br>
                    <strong>Address:</strong> ${postInfo.address} <br>
                    <strong>Description:</strong> ${postInfo.description} <br>
                    <strong>Monthly Rent:</strong> ${postInfo.price} <br>
                    
                    <br>
                    <div class="post-interactions">
                        <div>
                            <span title="${postInfo.bookmarks? escapeHTML(postInfo.bookmarks.join(", ")) : ""}"> ${postInfo.bookmarks ? `${postInfo.bookmarks.length}` : 0} bookmark </span> &nbsp; &nbsp; 
                            <span class="heart-button-span ${myIdentity? "": "d-none"}">
                                ${postInfo.bookmarks && postInfo.bookmarks.includes(myIdentity) ? 
                                    `<button class="heart_button" onclick='unbookmarkPost("${postInfo.id}")'>&#x2665;</button>` : 
                                    `<button class="heart_button" onclick='bookmarkPost("${postInfo.id}")'>&#x2661;</button>`} 
                            </span>
                        </div>
                        <br>
                        <button onclick='toggleComments("${postInfo.id}")'>View/Hide review</button>
                        <div id='comments-box-${postInfo.id}' class="comments-box d-none">
                            <button onclick='refreshComments("${postInfo.id}")')>refresh</button>
                            <div id='comments-${postInfo.id}'></div>
                            <div class="new-comment-box ${myIdentity? "": "d-none"}">
                                New Review:
                                <textarea type="textbox" id="new-comment-${postInfo.id}"></textarea>
                                <button onclick='postComment("${postInfo.id}")'>Post Review</button>
                            </div>
                        </div>
                    </div>
                </div>`
    }).join("\n");

    document.getElementById("posts_box").innerHTML = postsHtml;
}

// method for uploading a new post
async function postInformation(){
    document.getElementById("postStatus").innerHTML = "sending data..."
    let contact = document.getElementById("contactInput").value;
    let housing = document.getElementById("housingNameInput").value;
    let zipcode = document.getElementById("zipcodeInput").value;
    let address = document.getElementById("addressInput").value;
    let description = document.getElementById("descriptionInput").value;
    let price = document.getElementById("priceInput").value;


    try {
        await fetchJSON(`api/${apiVersion}/posts`, {
            method: "POST",
            body: 
            {
                contact: contact,
                housing: housing,
                zipcode: zipcode,
                address: address,
                description: description,
                price: price,
            }
        })
    } catch (error) {
        document.getElementById("postStatus").innerText = "Error"
        throw (error)
    }

    document.getElementById("contactInput").value = "";
    document.getElementById("housingNameInput").value = "";
    document.getElementById("zipcodeInput").value = "";
    document.getElementById("addressInput").value = "";
    document.getElementById("descriptionInput").value = "";
    document.getElementById("priceInput").value = "";

    document.getElementById("postStatus").innerHTML = "successfully uploaded"
    loadPosts();
}

// bookmark a post
async function bookmarkPost(postID){
    await fetchJSON(`api/${apiVersion}/posts/bookmark`, {
        method: "POST",
        body: {postID: postID}
    })
    loadPosts();
}

// unbookmark a post
async function unbookmarkPost(postID){
    await fetchJSON(`api/${apiVersion}/posts/unbookmark`, {
        method: "POST",
        body: {postID: postID}
    })
    loadPosts();
}

// fetch comment 
function getCommentHTML(commentsJSON){
    return commentsJSON.map(commentInfo => {
        return `
        <div class="individual-comment-box">
            <div>${escapeHTML(commentInfo.comment)}</div>
            <div> - <a href="/userAccount.html?user=${encodeURIComponent(commentInfo.username)}">${commentInfo.username}</a>, ${commentInfo.created_date}</div>
        </div>`
    }).join(" ");
}

// comment toggler
async function toggleComments(postID){
    let element = document.getElementById(`comments-box-${postID}`);
    if (!element.classList.contains("d-none")) {
        element.classList.add("d-none");
    } else {
        element.classList.remove("d-none");
        let commentsElement = document.getElementById(`comments-${postID}`);
        if(commentsElement.innerHTML == ""){ // load comments if not yet loaded
            commentsElement.innerHTML = "loading..."

            let commentsJSON = await fetchJSON(`api/${apiVersion}/comments?postID=${postID}`)
            commentsElement.innerHTML = getCommentHTML(commentsJSON);          
        }
    }
}

// refresh comment
async function refreshComments(postID){
    let commentsElement = document.getElementById(`comments-${postID}`);
    commentsElement.innerHTML = "loading..."

    let commentsJSON = await fetchJSON(`api/${apiVersion}/comments?postID=${postID}`)
    commentsElement.innerHTML = getCommentHTML(commentsJSON);
}

// post comment
async function postComment(postID){
    let newComment = document.getElementById(`new-comment-${postID}`).value;

    let responseJson = await fetchJSON(`api/${apiVersion}/comments`, {
        method: "POST",
        body: {postID: postID, newComment: newComment}
    })
    document.getElementById(`new-comment-${postID}`).value = "";

    refreshComments(postID);
}