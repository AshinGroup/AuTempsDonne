<h1>Get contents from an URL</h1>
<?php
$json = file_get_contents('https://pokeapi.co/api/v2/type/15');
$obj = json_decode($json);

if ($obj !== null) {
    echo "Name: " . $obj->name . "<br>";

    foreach ($obj->pokemon as $pokemon) {
        echo $pokemon->pokemon->name . "<br>";
    }
} else {
    echo "Failed to decode JSON.";
}
?>