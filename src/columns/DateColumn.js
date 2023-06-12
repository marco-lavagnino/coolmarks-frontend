import { SearchOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Calendar, Col, Row, Select, theme } from "antd";
import dayjs from "dayjs";
import { useState, useMemo } from "react";

const CalendarLine = styled.div`
  margin-top: 1em;
  margin-bottom: 1em;
  display: flex;
  width: 300px;
  justify-content: space-around;
`;

function isInRange(rangeStart, rangeEnd, targetDate) {
  if (!rangeStart || !rangeEnd) return true;
  return (
    targetDate.isAfter(rangeStart.second(0).minute(0).hour(0)) &&
    targetDate.isBefore(rangeEnd.second(0).minute(0).hour(0).add(1, "day"))
  );
}

const getMonthOptions = (selectedYear) => {
  const today = dayjs();

  const options = [];
  const localeData = today.localeData();

  for (let i = 0; i < 12; i++) {
    const monthDate = today.year(selectedYear).month(i);

    if (!monthDate.isAfter(today)) {
      options.push(
        <Select.Option key={i} value={i} className="month-item">
          {localeData.monthsShort(monthDate)}
        </Select.Option>
      );
    }
  }

  return options;
};

const getYearOptions = (selectedYear) => {
  const today = dayjs();

  const options = [];

  for (let i = selectedYear - 3; i < selectedYear + 3; i += 1) {
    if (!today.year(i).isAfter(today)) {
      options.push(
        <Select.Option key={i} value={i} className="year-item">
          {i}
        </Select.Option>
      );
    }
  }

  return options;
};

const CalendarPicker = ({ onSelect, dates }) => {
  const { token } = theme.useToken();
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const [currentDate, setCurrentDate] = useState(dayjs());

  return (
    <div style={wrapperStyle}>
      <Calendar
        fullscreen={false}
        headerRender={({ value, onChange }) => {
          const year = value.year();
          const month = value.month();

          return (
            <div
              style={{
                padding: 8,
              }}
            >
              <Row gutter={8}>
                <Col>
                  <Select
                    size="small"
                    className="my-year-select"
                    value={year}
                    onChange={(newYear) => {
                      const now = value.clone().year(newYear);
                      onChange(now);
                    }}
                  >
                    {getYearOptions(year)}
                  </Select>
                </Col>
                <Col>
                  <Select
                    size="small"
                    value={month}
                    onChange={(newMonth) => {
                      const now = value.clone().month(newMonth);
                      onChange(now);
                    }}
                  >
                    {getMonthOptions(year)}
                  </Select>
                </Col>
              </Row>
            </div>
          );
        }}
        fullCellRender={(cellValue) => {
          const rangeStart = dates[0];
          const rangeEnd = dates[1] || dates[0];
          return (
            <Button
              type={
                rangeStart &&
                rangeEnd &&
                isInRange(rangeStart, rangeEnd, cellValue)
                  ? "primary"
                  : "text"
              }
              disabled={
                cellValue.month() !== currentDate.month() ||
                cellValue.isAfter(dayjs())
              }
              size="small"
            >
              {cellValue.date()}
            </Button>
          );
        }}
        onSelect={(date) => {
          // Little hack to fire onSelect only when an actual date is chosen
          if (
            date.month() === currentDate.month() &&
            date.year() === currentDate.year()
          ) {
            onSelect(date);
          }
          setCurrentDate(date);
        }}
      />
    </div>
  );
};

const shortDate = (date) => {
  if (!date) return;
  return date.toDate().toLocaleString(undefined, { dateStyle: "medium" });
};

export const useDateFiltering = (dataIndex) => {
  const [dates, setDates] = useState([]);
  const [filteringDates, setFilteringDates] = useState([]);

  return {
    filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <CalendarPicker
          onSelect={(date) => {
            if (dates.length === 2) {
              return setDates([date]);
            }
            const newDates = dates ? [...dates, date] : [date];
            newDates.sort((a, b) => a.toDate() - b.toDate());
            setDates(newDates);
          }}
          dates={dates}
        />
        <CalendarLine>
          {
            {
              0: "Pick a date range.",
              1: `Filter between ${shortDate(dates[0])} and...`,
              2: `Filter between ${shortDate(dates[0])} and ${shortDate(
                dates[1]
              )}?`,
            }[dates.length]
          }
        </CalendarLine>
        <CalendarLine>
          <Button
            onClick={() => {
              setDates([]);
              setFilteringDates([]);
              clearFilters();
              confirm();
            }}
            size="small"
            style={{
              width: 90,
            }}
            type="text"
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setFilteringDates(dates);
              setSelectedKeys(dates);
              confirm();
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
            disabled={dates.length !== 2}
          >
            Filter
          </Button>
        </CalendarLine>
      </div>
    ),
    onFilter: (something, record) => {
      if (filteringDates.length !== 2) return true;
      return isInRange(
        filteringDates[0],
        filteringDates[1],
        dayjs(record[dataIndex])
      );
    },
  };
};
