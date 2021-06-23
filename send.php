<?php
    require_once 'sms.ru.php';
    $smsru = new SMSRU('361DC247-77E1-D97A-A31A-2599D5E14674');
    
    $data = new stdClass();
    $data->to = '79996394850';
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