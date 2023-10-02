export const timeToNum = (time) => time.split(":").reduce((acc, cur) => 
                                                                acc == 0 ? 
                                                                parseInt(cur) :
                                                                 acc + (parseInt(cur)/60), 0); 

const parseEntry = (entry) => {
    let [days, time] = entry.meets.split(" ");
    time = time.split("-");
    return [days.split(/(?=[A-Z])/), time.map(timeToNum)];
}

const timeConflict =(time1, time2) => time1[0] < time2[1] && time2[0] < time1[1];

export const findConflict = (entry1, entry2) => {
    [entry1.days, entry1.time] = parseEntry(entry1);
    [entry2.days, entry2.time] = parseEntry(entry2);

    if (entry1.term == entry2.term){
        let dayConflict = entry1.days.map((elem) => entry2.days.includes(elem)).reduce((acc, cur) => acc || cur, false)
        if (dayConflict && timeConflict(entry1.time, entry2.time)){
            return true;
        }
    }
    return false;
}