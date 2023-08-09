<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ricardopenagos";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['title']) && isset($_POST['content'])) {
    $title = $_POST['title'];
    $content = $_POST['content'];

    $stmt = $conn->prepare("INSERT INTO noticias (titulo, contenido) VALUES (?, ?)");
    $stmt->bind_param("ss", $title, $content);

    if ($stmt->execute()) {
        echo json_encode(array("message" => "Noticia guardada con éxito"));
    } else {
        echo json_encode(array("message" => "Error al guardar la noticia"));
    }

    $stmt->close();
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $sql = "SELECT * FROM noticias ORDER BY id DESC";
    $result = $conn->query($sql);

    $news = array();
    while ($row = $result->fetch_assoc()) {
        $news[] = $row;
    }

    echo json_encode($news);
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['news_id']) && isset($_POST['name']) && isset($_POST['content'])) {
    $newsId = $_POST['news_id'];
    $name = $_POST['name'];
    $content = $_POST['content'];

    $stmt = $conn->prepare("INSERT INTO comentarios (id_noticia, nombre, contenido) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $newsId, $name, $content);

    if ($stmt->execute()) {
        echo json_encode(array("message" => "Comentario guardado con éxito"));
    } else {
        echo json_encode(array("message" => "Error al guardar el comentario"));
    }

    $stmt->close();
}

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['news_id'])) {
    $newsId = $_GET['news_id'];
    $sql = "SELECT * FROM comentarios WHERE id_noticia = $newsId ORDER BY id DESC";
    $result = $conn->query($sql);

    $comments = array();
    while ($row = $result->fetch_assoc()) {
        $comments[] = $row;
    }

    echo json_encode($comments);
}

$conn->close();
?>
