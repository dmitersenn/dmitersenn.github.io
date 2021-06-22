<?php
    require_once 'sms.ru.php';
    $smsru = new SMSRU('B9780512-1BAF-FA43-B132-18AC4B86E9B0');
    
    $data = new stdClass();
    $data->to = '79528224017';
    $data->text = 'Новая заявка. Имя: '.$_GET['name'].', Тел. '.$_GET['phone'];

    $sms = $smsru->send_one($data);
    
    if ($sms->status == "OK") {
        echo "Сообщение отправлено успешно. ";
        echo "Текст сообщения: $data->text ";
    } else {
        echo "Сообщение не отправлено. ";
        echo "Код ошибки: $sms->status_code. ";
        echo "Текст ошибки: $sms->status_text.";
    }
?>