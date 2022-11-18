// —————————————————————————————————————————————————————
// add class to target users with js or no js
// —————————————————————————————————————————————————————
document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");





// ——————————————————————————————————————————————————
// target links that open in a new tab, add A11Y elements
// https://www.w3.org/WAI/WCAG21/Techniques/general/G201.html
// ——————————————————————————————————————————————————
function targetBlankA11Y() {
    // make an array of all links
    var targetBlankLinks = document.getElementsByTagName("a");

    // loop through the array
    for (a in targetBlankLinks) {
        // if the link has an attribute of target=_blank
        if (targetBlankLinks[a].target == "_blank") {
            // create a span element for it
            var targetBlankLinksNode = document.createElement("span");
            var targetBlankLinksTextNode = document.createTextNode(
                "(Opens a new window)"
            );
            targetBlankLinksNode.appendChild(targetBlankLinksTextNode);

            // and attach it to the link
            targetBlankLinks[a].appendChild(targetBlankLinksNode);
        }
    }
}
targetBlankA11Y();




// —————————————————————————————————————————————————————
// is touch device
// detects if the user is using a touch device, 
// and then adds "touch-enabled" to the document/html element
// —————————————————————————————————————————————————————
function is_touch_device() {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    var mq = function (query) {
        return window.matchMedia(query).matches;
    }
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
    }
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
}



// —————————————————————————————————————————————————————
// is keyboard user
// detects if the user on the site is a keyboard user by detecting the usage of the tab keyboard key
// adds a class to the document/html element called 'keyboard-focus" 
// —————————————————————————————————————————————————————
(function () {
    'use strict';

    function keyboardFocus(e) {
        if (e.keyCode !== 9) {
            return;
        }

        switch (e.target.nodeName.toLowerCase()) {
            case 'input':
            case 'select':
            case 'textarea':
                break;
            default:
                document.documentElement.classList.add('keyboard-focus');
                document.removeEventListener('keydown', keyboardFocus, false);
        }
    }

    document.addEventListener('keydown', keyboardFocus, false);
})();



// —————————————————————————————————————————————————————
// add target _blank to all external links 
// (not coming from within the root domain), automatically
// —————————————————————————————————————————————————————
function targetBlank() {
    // remove subdomain of current site's url and setup regex
    var internal = location.host.replace("www.", "");
    internal = new RegExp(internal, "i");

    var a = document.getElementsByTagName('a'); // then, grab every link on the page
    for (var i = 0; i < a.length; i++) {
        var href = a[i].host; // set the host of each link
        if (!internal.test(href)) { // make sure the href doesn't contain current site's host
            a[i].setAttribute('target', '_blank'); // if it doesn't, set attributes
        }
    }
};
targetBlank();



// —————————————————————————————————————————————————————
// Is A11yClick
// https://github.com/svinkle/a11yclick
// Easily handle keyboard click events on non semantic button elements.
// —————————————————————————————————————————————————————
// usage
// $('#fake-button').on('click keydown', function(event) {
// if (a11yClick(event)) {
// Event logic
// }
// });

var a11yClick = function (event) {
    'use strict';

    var code = event.charCode || event.keyCode,
        type = event.type;

    if (type === 'click') {
        return true;
    } else if (type === 'keydown') {
        if (code === 32 || code === 13) {
            event.preventDefault();
            return true;
        }
    } else {
        return false;
    }
};


window.addEventListener('DOMContentLoaded', (event) => {
    // —————————————————————————————————————————————————————
    // search dropdown
    // —————————————————————————————————————————————————————
    var clicked = false;

    $('#toggleSearch').click(function () {
        toggleBtnClick();
    });

    $('#searchClose').click(function () {
        toggleBtnClick();
    });

    function toggleBtnClick() {
        if (clicked) {
            $('#searchContainer').addClass('search--hide');
            clicked = false;
        } else {
            $('#searchContainer').removeClass('search--hide');
            clicked = true;
            $('#s').focus();
        }
    }


    // ——————————————————————————————————————————————————
    // hamburger nav
    // ——————————————————————————————————————————————————
    var isSubmenuOpen = false;
    // grab the button to toggle the hamburger nav
    var toggle = document.querySelector("#navToggle");
    // grab the menu itself that houses all list items
    var menu = document.querySelector("#menu-main-menu");
    // grab the first link within a menu
    var firstLink = document.querySelector("#menu-main-menu > li:first-child > a");
    // grab every li with children
    var subnavItems = document.querySelectorAll(
        "#menu-main-menu li.menu-item-has-children"
    );
    // grab every a that is a direct decendent of an li with children
    var subnavLinks = document.querySelectorAll(
        "#menu-main-menu li.menu-item-has-children > a"
    );

    // toggle the main navigation
    // ——————————————————————————————————————————————————
    function toggleNav() {
        // main navigation is already visible, close it
        if (menu.classList.contains("is-active")) {
            toggle.setAttribute("aria-expanded", "false");
            menu.classList.remove("is-active");
        } else {
            // main navigation is not visible, open it
            menu.classList.add("is-active");
            toggle.setAttribute("aria-expanded", "true");
        }
    }
    toggle.addEventListener("click", toggleNav);

    //  prevent default behavior or all direct decendants, if menu not yet expanded
    // ——————————————————————————————————————————————————
    function deactivateParents() {
        subnavLinks.forEach((item) => {
            item.addEventListener("click", function (event) {
                if (item.parentElement.classList.contains("is-open")) {
                    item.unbind(event);
                } else {
                    event.preventDefault();
                }
            });
        });
    }
    deactivateParents();

    // toggle each submenu
    // ——————————————————————————————————————————————————
    // run through each subnav item
    subnavItems.forEach((item) => {
        // when we click on a parent menu item's link, open the subnav for it
        item.addEventListener("click", openSubNav);

        // if we click anywhere, check if the click was inside the subnavigation
        document.addEventListener("click", checkIfSubNav);

        function openSubNav(e) {
            // add/remove your open class to the li (instead of the link)
            item.classList.add("is-open");
        }

        function closeSubNav() {
            // add/remove your open class to the li (instead of the link)
            item.classList.remove("is-open");
        }

        // if the click is in a subnav, do nothing speical. If it's outside the subnav, close the subnav
        function checkIfSubNav(e) {
            var isClickInsideElement = item.contains(e.target);
            if (!isClickInsideElement) {
                closeSubNav();
            }
        }
    });






}); // end DOMContentLoaded
