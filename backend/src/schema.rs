// @generated automatically by Diesel CLI.
// Modified: changed Nullable<Integer> to Integer for primary key columns

diesel::table! {
    employee_metrics (id) {
        id -> Integer,
        user_id -> Integer,
        date -> Date,
        work_time_minutes -> Nullable<Integer>,
        manual_time_minutes -> Nullable<Integer>,
        computer_activity_minutes -> Nullable<Integer>,
        productive_minutes -> Nullable<Integer>,
        unproductive_minutes -> Nullable<Integer>,
        neutral_minutes -> Nullable<Integer>,
        break_time_minutes -> Nullable<Integer>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    employer_employees (id) {
        id -> Integer,
        employer_id -> Integer,
        employee_id -> Integer,
        department -> Nullable<Text>,
        role_title -> Nullable<Text>,
        status -> Text,
        start_date -> Nullable<Date>,
        end_date -> Nullable<Date>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

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

diesel::joinable!(employee_metrics -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(employee_metrics, employer_employees, users,);
