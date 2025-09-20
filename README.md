Create leave:
User --> Frontend --> POST /leaves --> Backend validates -> DB
                                Backend -> Notify manager (email)
Manager --> Approve --> PATCH /leaves/:id/approve -> Backend updates DB -> notify user
