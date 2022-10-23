db.createUser({
  user: "color-user",
  pwd: "secretpw",
  roles: [
    {
      role: "readWrite",
      db: "colorful",
    },
  ],
});
