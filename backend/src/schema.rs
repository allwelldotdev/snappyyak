// @generated automatically by Diesel CLI.

diesel::table! {
    users (id) {
        id -> Integer,
        email -> Text,
        fullname -> Text,
        password -> Nullable<Text>,
        temp_password -> Nullable<Text>,
        role -> Text,
        created_at -> Timestamp,
    }
}
