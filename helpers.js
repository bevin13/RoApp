
const getNextSessionsHelper = (userList) => {
    const result = {
        quiz: "",
        quizCount: 0,
        quizFlag: false,
        techSession: "",
        techSessionCount: 0,
        techSessionFlag: false,
        nonTechSession: "",
        nonTechSessionCount: 0,
        nonTechSessionFlag: false,
    };

    const types = ["quiz", "techSession", "nonTechSession"];

    for (let type of types) {
        let newUserList = userList.filter(
            (each) =>
                each.lastSession !== type && !Object.values(result).includes(each.name)
        );

        for (let i = 0; i < newUserList.length; i++) {
            if (!result[`${type}Flag`]) {
                result[`${type}Count`] = newUserList[i][type];
                result[`${type}Flag`] = true;
                result[`${type}`] = newUserList[i].name;
            }
            console.log("bdsb", result);
            if (newUserList[i][type] < result[`${type}Count`]) {
                console.log("first");
                result[`${type}Count`] = newUserList[i][type];
                result[type] = newUserList[i].name;
            }
        }
    }
    return result;
};

module.exports = {
    getNextSessionsHelper
}