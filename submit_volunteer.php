<?php
include 'db_connect.php'; // Ensure this file has the correct database connection setup

$message = ''; // Initialize the message variable to avoid undefined variable warnings

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $availability = $_POST['availability'];
    $interests = $_POST['interests'];

    // Prepared statement with placeholders
    $sql = "INSERT INTO volunteers (name, email, availability, interests) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die('MySQL prepare error: ' . $conn->error);
    }

    // Binding parameters
    $stmt->bind_param("ssss", $name, $email, $availability, $interests);
    if ($stmt->execute()) {
        $message = "Volunteer request sent successfully!";
    } else {
        $message = "Error: " . $stmt->error;
    }
    $stmt->close();
    $conn->close();
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submission Status</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .alert-success {
            color: #155724;
            background-color: #d4edda;
            border-color: #c3e6cb;
        }
    </style>
</head>
<body>
    <div class="container mt-5">
        <div class="alert alert-success" role="alert">
            <?php echo $message; ?>
        </div>
        <a href="volunteer.html" class="btn btn-primary">Return to Volunteer Page</a>
    </div>
</body>
</html>
