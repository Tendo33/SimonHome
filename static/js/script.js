console.log('%cCopyright © 2025 simonsun.cc',
    'background-color:rgb(6, 113, 245); color: white; font-size: 24px; font-weight: bold; padding: 10px;'
);

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

function handlePress(event) {
    this.classList.add('pressed');
}

function handleRelease(event) {
    this.classList.remove('pressed');
}

function handleCancel(event) {
    this.classList.remove('pressed');
}

var buttons = document.querySelectorAll('.projectItem');
buttons.forEach(function (button) {
    button.addEventListener('mousedown', handlePress);
    button.addEventListener('mouseup', handleRelease);
    button.addEventListener('mouseleave', handleCancel);
    button.addEventListener('touchstart', handlePress);
    button.addEventListener('touchend', handleRelease);
    button.addEventListener('touchcancel', handleCancel);
});

function toggleClass(selector, className) {
    var elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
        element.classList.toggle(className);
    });
}

function pop(imageURL) {
    console.log('pop function called with URL:', imageURL);
    var tcElement = document.querySelector(".tc");
    var tcMainElement = document.querySelector(".tc-main");
    if (!tcElement || !tcMainElement) {
        console.error('Required elements not found');
        return;
    }
    // 确保图片元素存在
    var tcImgElement = tcMainElement.querySelector("img");
    if (!tcImgElement) {
        console.log('Creating new image element');
        tcImgElement = document.createElement('img');
        tcImgElement.className = 'tc-img';
        tcMainElement.appendChild(tcImgElement);
    }
    console.log('Elements found:', {
        tc: tcElement,
        tcMain: tcMainElement,
        tcImg: tcImgElement
    });
    if (imageURL) {
        var img = new Image();
        img.onload = function() {
            console.log('Image loaded successfully');
            tcImgElement.src = imageURL;
            tcElement.classList.add("active");
            tcMainElement.classList.add("active");
        };
        img.onerror = function() {
            console.error('Failed to load image:', imageURL);
        };
        img.src = imageURL;
    } else {
        tcElement.classList.remove("active");
        tcMainElement.classList.remove("active");
    }
}
window.pop = pop;

var tc = document.querySelector('.tc');
var tc_main = document.querySelector('.tc-main');

if (tc) {
    tc.addEventListener('click', function(event) {
        if (event.target === tc) {
            pop();
        }
    });
}

if (tc_main) {
    tc_main.addEventListener('click', function(event) {
        event.stopPropagation();
    });
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function () {

    var html = document.querySelector('html');
    var themeState = getCookie("themeState") || "Light";
    var tanChiShe = document.getElementById("tanChiShe");

    function changeTheme(theme) {
        tanChiShe.src = "https://raw.githubusercontent.com/Tendo33/Tendo33/output/github-snake" + (theme === "Dark" ? "-dark" : "") + ".svg";
        html.dataset.theme = theme;
        setCookie("themeState", theme, 365);
        themeState = theme;
    }

    var Checkbox = document.getElementById('myonoffswitch')
    Checkbox.addEventListener('change', function () {
        if (themeState == "Dark") {
            changeTheme("Light");
        } else if (themeState == "Light") {
            changeTheme("Dark");
        } else {
            changeTheme("Dark");
        }
    });

    if (themeState == "Dark") {
        Checkbox.checked = false;
    }

    changeTheme(themeState);

    var fpsElement = document.createElement('div');
    fpsElement.id = 'fps';
    fpsElement.style.zIndex = '10000';
    fpsElement.style.position = 'fixed';
    fpsElement.style.left = '0';
    document.body.insertBefore(fpsElement, document.body.firstChild);

    var showFPS = (function () {
        var requestAnimationFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };

        var fps = 0,
            last = Date.now(),
            offset, step, appendFps;

        step = function () {
            offset = Date.now() - last;
            fps += 1;

            if (offset >= 1000) {
                last += offset;
                appendFps(fps);
                fps = 0;
            }

            requestAnimationFrame(step);
        };

        appendFps = function (fpsValue) {
            fpsElement.textContent = 'FPS: ' + fpsValue;
        };

        step();
    })();

    //pop('./static/img/tz.jpg')

});

var pageLoading = document.querySelector("#simon-loading");
window.addEventListener('load', function () {
    setTimeout(function () {
        pageLoading.style.opacity = '0';
    }, 100);
});

