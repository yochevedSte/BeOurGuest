
user = {
    username: "String",
    password: "String",
    email: "String",
    events: [
        Title: "String",
        Date: "String",
        Location: "String",
        maxGuests: "Number",
        HostName: "String",
        tables: [
            title: "String",
            maxGuests: "Number",
            categories: [
                name: "String",
                colorCode: "String"
            ],
            guests: [
                globalGuest_id: {
                    name: "String",
                    email: "String",
                    phone: "String",
                },
                comment: "String",
                numConfirmed: "Number",
                numUndecided: "Number",
                numNotComing: "Number"
                       invitations: [
                    invitationName: String,
                    titleInput: String,
                    textInput: String,
                    background: String,
                    titleColor: String,
                    bodyColor: String,
                    fontTitle: String,
                    fontBody: String,
                    whenEvent: String,
                    whereEvent: String
                ],
                categories: [
                    name: "String",
                    colorCode: "String"
                ],
            ]
        ],
        invitations: [
            invitationName: String,
            titleInput: String,
            textInput: String,
            background: String,
            titleColor: String,
            bodyColor: String,
            fontTitle: String,
            fontBody: String,
            whenEvent: String,
            whereEvent: String
        ],
        guests: [
            globalGuest_id: {
                name: "String",
                email: "String",
                phone: "String",
            },
            invitations: [
                invitationName: String,
                titleInput: String,
                textInput: String,
                background: String,
                titleColor: String,
                bodyColor: String,
                fontTitle: String,
                fontBody: String,
                whenEvent: String,
                whereEvent: String
            ],
            categories: [
                name: "String",
                colorCode: "String"
            ],
            comment: "String",
            numConfirmed: "Number",
            numUndecided: "Number",
            numNotComing: "Number"
        ],
    ],
    guests: [
        name: "String",
        email: "String",
        phone: "String",
    ],
    categories: [
        name: "String",
        colorCode: "String"
    ]

}



// border: solid 1px grey;
// padding: 15px;
// background-color: green;
// z-index: 8;
// color: red;
// font-size: 20px;