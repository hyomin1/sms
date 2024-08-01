import moment from "moment";
import React, { useState } from "react";
import Calendar from "react-calendar";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

function StudyCalendar() {
  const [value, setValue] = useState<Value>(new Date());
  return (
    <div>
      <Calendar
        onChange={setValue}
        value={value}
        formatDay={(locale, date) => moment(date).format("DD")}
      />
    </div>
  );
}

export default StudyCalendar;
