export function hideMenuItems(items) {
    const hideItemsById = (ids) => {
        ids.forEach((id) => {
            let found = items.find(function (item) {
                return item.id === id;
            });
            items.splice(items.indexOf(found), 1);
        })
    }

    let currentuser = JSON.parse(localStorage.getItem("sg_user"));
    if (currentuser && currentuser.username === "readall") {
        hideItemsById(["kibana:management", "kibana:dev_tools", "kibana:discover", "kibana:visualize", "kibana:dashboard", "timelion"])
    } else if (currentuser && currentuser.username !== "bitergia") {
        hideItemsById(["kibana:management", "kibana:dev_tools"])
    }
}
