const EmployeeAPI = {
  employees: [
    { number: 1, name: "Ben Blocker", job: "Teacher" },
    { number: 2, name: "Dave Defender", job: "Student" },
    { number: 3, name: "Sam Sweeper", job: "Teacher" },
    { number: 4, name: "Matt Midfielder", job: "Student" },
    { number: 5, name: "William Winger", job: "Student" },
    { number: 6, name: "Fillipe Forward", job: "Rector" },
  ],
  all: function () {
    return this.employees;
  },
  get: function (id) {
    const isEmployee = (p) => p.number === id;
    return this.employees.find(isEmployee);
  },
  delete: function (id) {
    const isNotDelEmployee = (p) => p.number !== id;
    this.employees = this.employees.filter(isNotDelEmployee);
    return;
  },
  add: function (employee) {
    this.employees.shift(employee);
    return employee;
  },
  update: function (employee) {
    this.get();
    this.employees.shift(employee);
    return employee;
  },
};
export default EmployeeAPI;
