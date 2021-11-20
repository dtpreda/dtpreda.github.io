async function text_load(path) {
    document.getElementById("body").classList.remove("preload");

    try {
        let text_data = await get_file(path);

        var text = text_data.split('\n');

        
        var div = document.createElement("div");
        div.classList.add("content");
        
        for (var i = 0; i < text.length / 2; i++) {
            if (text[2*i] == "title") {
                var h1 = document.createElement("h1");
                
                h1.innerHTML = text[2*i + 1];
                div.appendChild(h1);
            } else if (text[2*i] == "content") {
                var p = document.createElement("p");
                
                p.innerHTML = text[2*i +1];
                div.appendChild(p);
            }
        }
        document.getElementById("bd").appendChild(div);
    } catch (e) {
        console.log(e.message);
    }
};

async function get_file(path) {
    let response = await fetch(path);

    if (response.status != 200) {
        throw new Error("Server error");
    }

    let text_data = await response.text();

    return text_data;
};