async function init(){
    await loadIdentity();
    loadUserInfo();
}

// save user updated info 
async function saveUserInfo(){
    document.getElementById("changeStatus").innerHTML = "sending data..."

    let newName = document.getElementById("change_name").value

    if (newName !== "") {
        await fetch(`/api/${apiVersion}/users`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({
                name: newName
            })
        })
    }
    document.getElementById("change_name").value = "";

    document.getElementById("changeStatus").innerHTML = "successfully uploaded";

    loadUserInfo();
}

// load user updated info
async function loadUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    if (username===myIdentity) {
        document.getElementById("username-span").innerText= `You (${username})`;
    } else {
        document.getElementById("username-span").innerText=username;
        document.getElementById('user_info_new_div').classList.add('d-none');
    }
    
    let response = await fetch(`/api/${apiVersion}/users`)
    let usersJson = await response.json()

    let chosenUser = usersJson.filter(userInfo => userInfo.username === username)

    let userInfo = chosenUser.map(userInfo => {
        return `
        <hr>
            <div>
                <h3>Username: ${username} </h3>
                <strong>Email: </strong> ${userInfo.email} <br>
                <strong>Name: </strong> ${userInfo.name} <br>
            </div>
        </hr>
        `
    })

    document.getElementById("user_info_div").innerHTML = userInfo

    loadUserInfoPosts(username);
    loadBookmarkedPosts(username);
}

// load user's bookmarked posts
async function loadBookmarkedPosts(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');

    let housingJson = await fetchJSON(`api/${apiVersion}/users/myBookmarkedPosts?username=${username}`);
    housingJson = housingJson[0].myBookmarks;

    let postsHtml = housingJson.map(housingInfo => {
        return `
        <div class="post">
            <strong>${housingInfo} </strong>
        </div>`
    }).join("\n");

    document.getElementById("bookmarked_apt_list").innerHTML = postsHtml;
}

// load user's post
async function loadUserInfoPosts(username){
    document.getElementById("apt_list").innerText = "Loading...";
    let postsJson = await fetchJSON(`api/${apiVersion}/posts?username=${encodeURIComponent(username)}`);
    let postsHtml = postsJson.map(postInfo => {
        return `
        <div class="post">
            <strong>${escapeHTML(postInfo.housing)} </strong>
            <strong>Information Provider: </strong> ${escapeHTML(postInfo.name)}
            <br>
            <strong>Best Way of Contact:</strong> ${escapeHTML(postInfo.contact)}
            <br>
            <strong>Zipcode:</strong> ${escapeHTML(postInfo.zipcode)}
            <br>
            <strong>Address:</strong> ${escapeHTML(postInfo.address)}
            <br>
            <strong>Description:</strong> ${escapeHTML(postInfo.description)}
            <br>
            <strong>Monthly Rent:</strong> ${escapeHTML(postInfo.price)}
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
                <div><button onclick='deletePost("${postInfo.id}")' class="${postInfo.username==myIdentity ? "": "d-none"}">Delete</button></div>
            </div>
        </div>`
    }).join("\n");

    document.getElementById("apt_list").innerHTML = postsHtml;
}