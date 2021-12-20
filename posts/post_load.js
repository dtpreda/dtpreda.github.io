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

                intro.style.flexGrow = "0";

                children.push(intro);
            } else if (text[2*i] == "--start content") {
                var content = document.createElement("div");
                content.classList.add("content");

                while (text[2*i] != "--end content") {
                    i++;
                    add_content(text[2*i], text[2*i + 1], content);
                }

                content.style.flexGrow = "0";

                children.push(content);
            } else if (text[2 * i] == "--start split") {
                var max_height = "";

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

                    } if (text[2 * i] == "--start img") {
                        i++;

                        if (text[2 * i] == "--img") {
                            n++;
                            var div = document.createElement("div");
                            div.classList.add("content");
                            div.classList.add("img-div");
                            
                            var img = document.createElement("img");
                            img.src = text[2 * i + 1];
                            img.classList.add("img");

                            i++;
                            if (text[2 * i] == "--height") {
                                max_height = text[2 * i + 1] + "px";
                                div.appendChild(img);
                                split.appendChild(div);
                            }
                            
                        }

                        i++;

                    }
                }

                split.style.flexGrow = "0";

                split.style.marginTop = "-10px";
                
                var p = 100 / n;
                for (var j = 0; j < split.children.length; j++) {
                    var child = split.children[j];
                    child.style.width = p.toString() + "%";
                    if (max_height != "") {
                        child.style.height = max_height;
                    }
                    if (j > 0) {
                        child.style.marginLeft = "0";
                    }
                }
                
                children.push(split);
            } else if (text[2*i] == "--start body") {
                var body = document.createElement("div");
                body.classList.add("content");

                while (text[2*i] != "--end body") {
                    i++;
                    add_content(text[2*i], text[2*i + 1], body);
                }

                body.style.marginTop = "0";

                body.style.flexGrow = "1";

                children.push(body);
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