export function redirectAnonymousUser() {
    let currentuser = JSON.parse(localStorage.getItem("sg_user"));
    if (currentuser && currentuser.username === "readall") {
        window.location.replace(window.location.href.split("app/")[0] + "app/kibana#/dashboard/Overview")
    }
    return true
}