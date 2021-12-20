async function add_posts() {
    document.getElementById("body").classList.remove("preload");

    let first = document.getElementById("first");
    let second = document.getElementById("second");
    let third = document.getElementById("third");
    let fourth = document.getElementById("fourth");

    add_post_to("/post/ic/around-static.ic", "/post/posts/around-static.html", first);
};

async function get_file(path) {
    let response = await fetch(path);

    if (response.status != 200) {
        throw new Error("Server error");
    }

    let text_data = await response.text();

    return text_data;
};

function add_content(type, content, parent) {
    if (type == "--h1") {
        var h1 = document.createElement("h1");
        
        h1.innerHTML = content;
        parent.appendChild(h1);
    }
    else if (type == "--text") {
        var p = document.createElement("p");
        
        p.innerHTML = content;
        parent.appendChild(p);
    } else if (type == "--img") {
        var img = document.createElement("img");
        img.classList.add("head");

        img.src = content;
        parent.appendChild(img);
    }
};

async function add_post_to(post, link, parent) {
    
    let text_data = await get_file(post);
    var a = document.createElement("a");
    a.classList.add("a");
    var div = document.createElement("div");
    div.classList.add("post");
    div.classList.add("content");
    
    var text = text_data.split('\n');
    
    if (text[4] == "--head") {
        add_content("--img", text[5], div);
    }

    if (text[0] == "--title") {
        add_content("--h1", text[1], div);
    }

    if (text[2] == "--description") {
        add_content("--text", text[3], div);
    }

    a.href = link;

    a.appendChild(div);
    parent.appendChild(a);
};