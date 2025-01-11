@echo off
echo Building application...
call npm run build

echo.
echo Creating temp directory...
call ssh -i "../../../aws/webber-usa.pem" ubuntu@ec2-184-169-131-60.us-west-1.compute.amazonaws.com "mkdir -p ~/nightcrawler-management-temp"

echo.
echo Uploading files to EC2...
call scp -i "../../../aws/webber-usa.pem" -r dist/* ubuntu@ec2-184-169-131-60.us-west-1.compute.amazonaws.com:~/nightcrawler-management-temp/

echo.
echo Moving files and setting permissions...
call ssh -i "../../../aws/webber-usa.pem" ubuntu@ec2-184-169-131-60.us-west-1.compute.amazonaws.com "sudo rm -rf /var/www/nightcrawler-management.webber.com.ar/* && sudo mv ~/nightcrawler-management-temp/* /var/www/nightcrawler-management.webber.com.ar/ && sudo chown -R www-data:www-data /var/www/nightcrawler-management.webber.com.ar && sudo chmod -R 755 /var/www/nightcrawler-management.webber.com.ar && rm -rf ~/nightcrawler-management-temp"

echo.
echo Deployment complete!
pause