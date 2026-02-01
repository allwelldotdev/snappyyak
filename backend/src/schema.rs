// @generated automatically by Diesel CLI.

diesel::table! {
    users (id) {
        id -> Integer,
        email -> Text,
        fullname -> Text,
        password -> Text,
        created_at -> Timestamp,
    }
}
