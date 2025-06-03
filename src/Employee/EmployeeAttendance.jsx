import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const statusStyles = {
  'P': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'WO': 'bg-gray-100 text-gray-800 border-gray-200',
  'CL': 'bg-amber-100 text-amber-800 border-amber-200',
  'EL': 'bg-blue-100 text-blue-800 border-blue-200',
  'HO': 'bg-purple-100 text-purple-800 border-purple-200',
};

const generateMockData = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  return Array.from({ length: daysInMonth }, (_, i) => ({
    date: i + 1,
    timeRange: '06:00-05:59',
    totalHours: Math.random() > 0.3 ? `0${Math.floor(Math.random() * 4 + 8)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : '00:00',
    status: ['P', 'WO', 'CL', 'EL', 'HO'][Math.floor(Math.random() * 5)],
  }));
};

export default function EmployeeAttendance() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const calendarData = generateMockData(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const totalCells = 42; // 6 rows * 7 days

  return (
    <div className="p-1 space-y-1 text-sm">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-lg font-semibold">Attendance Calendar</h1>
        <div className="flex items-center gap-1">
          <button
            className="p-1 border rounded  bg-gray-300  hover:bg-gray-400"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <select
            value={`${currentDate.getMonth()}-${currentDate.getFullYear()}`}
            onChange={(e) => {
              const [month, year] = e.target.value.split('-').map(Number);
              setCurrentDate(new Date(year, month));
            }}
            className="p-1 border rounded text-sm"
          >
            {months.map((month, index) => (
              <option key={month} value={`${index}-${currentDate.getFullYear()}`}>
                {month} {currentDate.getFullYear()}
              </option>
            ))}
          </select>
          <button
            className="p-1 border rounded  bg-gray-300  hover:bg-gray-400"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="grid grid-cols-7 border-b">
          {days.map(day => (
            <div
              key={day}
              className="px-1 py-1 text-center text-base font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: totalCells }).map((_, index) => {
            const dayNumber = index - firstDayOfMonth + 1;
            const isCurrentMonth = dayNumber > 0 && dayNumber <= totalDays;
            const day = isCurrentMonth ? calendarData[dayNumber - 1] : null;

            return (
              <div
                key={index}
                className={`min-h-[60px] border-b border-r p-1 ${
                  index % 7 === 6 ? 'border-r-0' : ''
                } ${
                  index >= 35 ? 'border-b-0' : ''
                }`}
              >
                {isCurrentMonth && day ? (
                  <div className="space-y-0.5">
                    <div className="text-xs font-medium">{day.date}</div>
                    {/* <div className="text-[10px] text-gray-500">{day.timeRange}</div>
                    <div className="text-[10px] font-medium">
                      Total: {day.totalHours}
                    </div> */}
                    {day.status && (
                      <div className={`mt-0.5 inline-flex items-center rounded border px-1 py-0.5 text-[10px] font-medium ${statusStyles[day.status]}`}>
                        {day.status}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-1 flex flex-wrap gap-1">
        <div className="text-[15px] align-middle text-gray-500"><b>Legend:</b></div>
        {Object.entries(statusStyles).map(([status, style]) => (
          <div
            key={status}
            className={`inline-flex items-center rounded border px-1 py-0.5 text-[10px] font-medium ${style}`}
          >
            {status} - {status === 'P' ? 'Present' :
                       status === 'WO' ? 'Weekend Off' :
                       status === 'CL' ? 'Casual Leave' :
                       status === 'EL' ? 'Earned Leave' :
                       'Holiday'}
          </div>
        ))}
      </div>
    </div>
  );
}