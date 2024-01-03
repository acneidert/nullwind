import Nullstack from "nullstack";

import dayjs from "dayjs";
import { DateTimePicker } from "nullwind";

class Preview extends Nullstack {
  date_normal = new Date("01/01/2023");
  date_sql = new Date("2023-02-01");
  today = dayjs();
  today_with_time = dayjs();
  today_null = null;
  hydrate() {
    require("dayjs/locale/pt-br");
    dayjs.locale("pt-br");
  }
  render() {
    return (
      <>
        {this.date_normal}
        <DateTimePicker bind={this.date_normal} format="MMM/YY" />
        {this.date_sql}
        <DateTimePicker bind={this.date_sql} format="YYYYMMDD" />
        {this.today}
        <DateTimePicker bind={this.today} />
        {this.today_with_time}
        <DateTimePicker bind={this.today_with_time} format="DD/MM/YYYY HH:mm" />
        {this.today_null}
        <DateTimePicker bind={this.today_null} format="DD/MM/YYYY HH:mm" />
      </>
    );
  }
}

export default Preview;
