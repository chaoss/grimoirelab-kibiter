export function redirectNonBitergiaUser() {
    let currentuser = JSON.parse(localStorage.getItem("sg_user"));
    if (currentuser && currentuser.username !== "bitergia") {
        window.location.replace(window.location.href.split("app/")[0] + "app/kibana#/dashboard/Overview")
    }
    return true
}