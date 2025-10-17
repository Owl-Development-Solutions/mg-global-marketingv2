import { User } from "../models";

export const sampleUsers: any[] = [
  {
    id: "u1",
    firstName: "John",
    lastName: "Taylor",
    email: "john.taylor@gmail.com",
    title: "Software Engineer",
    connections: [
      { id: "u2", type: "colleague", since: "2022-03-15" },
      { id: "u3", type: "friend", since: "2020-06-10" },
    ],
  },
  {
    id: "u2",
    firstName: "Maria",
    lastName: "Lopez",
    email: "maria.lopez@gmail.com",
    title: "Project Manager",
    connections: [
      { id: "u1", type: "colleague", since: "2022-03-15" },
      { id: "u4", type: "family", since: "2018-01-02" },
    ],
  },
  {
    id: "u3",
    firstName: "David",
    lastName: "Nguyen",
    email: "david.nguyen@gmail.com",
    title: "UI/UX Designer",
    connections: [
      { id: "u1", type: "friend", since: "2020-06-10" },
      { id: "u5", type: "mentor", since: "2019-09-25" },
    ],
  },
  {
    id: "u4",
    firstName: "Sophia",
    lastName: "Chen",
    email: "sophia.chen@gmail.com",
    title: "Data Scientist",
    connections: [{ id: "u2", type: "family", since: "2018-01-02" }],
  },
  {
    id: "u5",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@gmail.com",
    title: "CTO",
    connections: [{ id: "u3", type: "mentor", since: "2019-09-25" }],
  },
];
