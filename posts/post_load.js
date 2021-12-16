async function text_load(path) {
    document.getElementById("body").classList.remove("preload");

    try {
        let text_data = await get_file(path);

        var text = text_data.split('\n');
        var children = new Array();

        for (var i = 0; i < text.length / 2; i++) {
            if (text[2*i] == "--title") {
                document.title = text[2*i + 1];
            }
            else if (text[2*i] == "--start intro") {
                var intro = document.createElement("div");
                intro.classList.add("content");

                while (text[2*i] != "--end intro") {
                    i++;
                    add_content(text[2*i], text[2*i + 1], intro);
                }

                children.push(intro);
            } else if (text[2*i] == "--start content") {
                var content = document.createElement("div");
                content.classList.add("content");

                while (text[2*i] != "--end content") {
                    i++;
                    add_content(text[2*i], text[2*i + 1], content);
                }

                children.push(content);
            } else if (text[2*i] == "--start split") {
                var split =document.createElement("div");
                split.classList.add("split");
                
                var n = 0;
                while (text[2*i] != "--end split") {
                    i++;
                    
                    if (text[2*i] == "--start") {
                        n++;
                        var div = document.createElement("div");
                        div.classList.add("content");
                        
                        while (text[2*i] != "--end") {
                            i++;
                            add_content(text[2*i], text[2*i + 1], div);
                        }
                        split.appendChild(div);
                    }
                }

                split.style.marginTop = "-10px";
                
                var p = 100 / n;
                for (var j = 0; j < split.children.length; j++) {
                    var child = split.children[j];
                    child.style.width = p.toString() + "%";
                    if (j > 0) {
                        child.style.marginLeft = "0";
                    }
                }
                
                children.push(split);
            }
        }

        for (var i = 0; i < children.length; i++) {
            document.getElementById("bd").appendChild(children[i]);
        }
    } catch (e) {
        console.log(e.message);
    }
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