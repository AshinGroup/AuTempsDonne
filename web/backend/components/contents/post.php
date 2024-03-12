<h1>Post contents from an URL</h1>
<?php
$postdata = http_build_query(
    array(
        'var1' => 'some content',
        'var2' => 'doh'
    )
);
$username = 'your_username';
$password = 'your_password';

// $ch = curl_init('http://example.com/submit.php');
$ch = curl_init('https://pokeapi.co/api/v2/type/15');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Pour POST,PATCH,DELETE
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Authorization: Basic ' . base64_encode("$username:$password"),
    'Content-Type: application/x-www-form-urlencoded'
));

$result = curl_exec($ch);

if ($result !== false) {
    echo "Success: Data sent successfully.";
} else {
    echo "Error: Failed to send data. " . curl_error($ch);
}

curl_close($ch);
?>