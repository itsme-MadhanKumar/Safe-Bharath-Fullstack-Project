package com.example.bankSystem.repository;
import com.example.bankSystem.DAO.DatabaseDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Repository
public class UserPaymentRepo
{
    @Autowired
    private DatabaseDAO databaseDAO;

    public boolean isUserGeneratedPaymentPasswordRepo(String userId)
    {
        String query = "SELECT payment_password FROM users WHERE aadhar = ?";
        try(Connection connection = databaseDAO.getConnection();
            PreparedStatement ps = connection.prepareStatement(query))
        {
            ps.setString(1,userId);
            ResultSet rs = ps.executeQuery();
            if(rs.next())
            {
                String payment_Password = rs.getString("payment_password");
                if(payment_Password==null)
                {
                    return false;
                }
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
        return true;
    }

    public String CurrentUserBalanceRepo(String userId)
    {
        String query = "SELECT balance FROM users WHERE aadhar = ?";

        try(Connection connection = databaseDAO.getConnection();
        PreparedStatement ps = connection.prepareStatement(query))
        {
            ps.setString(1,userId);
            ResultSet rs = ps.executeQuery();
            if(rs.next())
            {
                return rs.getString("balance");
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
        return "not found";
    }


    public boolean UpdatingCurrentBalanceRepo(String userId,String money)
    {
        String query = "UPDATE users SET balance = ? WHERE aadhar = ?";
        try(Connection connection = databaseDAO.getConnection();
        PreparedStatement ps = connection.prepareStatement(query))
        {
            ps.setString(1,money);
            ps.setString(2,userId);

            int affected = ps.executeUpdate();
            if(affected>0)
            {
                return true;
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
        return false;
    }


    public void UpdatingTransactionHistory(String utr, String sender, String receiver, String money, String status, String bankBalance) {
        String query = "INSERT INTO transaction_history (" +
                "UTR_id, Sender_id, Receiver_id, Credited,Debited, time_stamp, payment_status, bank_balance" +
                ") VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        // Format the current timestamp to match MySQL DATETIME format
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        try (Connection connection = databaseDAO.getConnection();
             PreparedStatement ps = connection.prepareStatement(query)) {

            ps.setString(1, utr);
            ps.setString(2, "-");
            ps.setString(3, receiver);
            ps.setString(4, money);
            ps.setString(5,money);
            ps.setString(6, currentTime);       // ✅ Proper timestamp
            ps.setString(7, status);
            ps.setString(8, bankBalance);

            int affected = ps.executeUpdate();
            if (affected > 0) {
                System.out.println("Transaction DB updated");
            } else {
                System.out.println("Transaction DB not updated");
            }

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }


    public void UpdatingTransactionHistoryofSendMoney(String utr, String sender, String receiver, String money, String status, String bankBalance) {
        String query = "INSERT INTO transaction_history (" +
                "UTR_id, Sender_id, Receiver_id, Credited,Debited, time_stamp, payment_status, bank_balance" +
                ") VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        // Format the current timestamp to match MySQL DATETIME format
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        try (Connection connection = databaseDAO.getConnection();
             PreparedStatement ps = connection.prepareStatement(query)) {

            ps.setString(1, utr);
            ps.setString(2, sender);
            ps.setString(3, receiver);
            ps.setString(4, money);
            ps.setString(5,money);
            ps.setString(6, currentTime);       // ✅ Proper timestamp
            ps.setString(7, status);
            ps.setString(8, bankBalance);

            int affected = ps.executeUpdate();
            if (affected > 0) {
                System.out.println("Transaction DB updated");
            } else {
                System.out.println("Transaction DB not updated");
            }

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }


    public void UpdatingFailedTransactionHistory(String utr, String sender, String receiver, String money, String status, String bankBalance) {
        String query = "INSERT INTO transaction_history (" +
                "UTR_id, Sender_id, Receiver_id, Credited,Debited, time_stamp, payment_status, bank_balance" +
                ") VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        // Format the current timestamp to match MySQL DATETIME format
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        try (Connection connection = databaseDAO.getConnection();
             PreparedStatement ps = connection.prepareStatement(query))
        {
            ps.setString(1, utr);
            ps.setString(2, "-");
            ps.setString(3, receiver);
            ps.setString(4, "-");
            ps.setString(5,money);
            ps.setString(6, currentTime);
            ps.setString(7, status+"- Rs: "+money);
            ps.setString(8, bankBalance);

            int affected = ps.executeUpdate();
            if (affected > 0)
            {
                System.out.println("Transaction DB updated");
            } else {
                System.out.println("Transaction DB not updated");
            }

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }


    public boolean verifyingPanAddress(String userId,String panID)
    {
        String query = "SELECT pan_id FROM users WHERE aadhar = ?";
        try(Connection connection = databaseDAO.getConnection();
        PreparedStatement preparedStatement =connection.prepareStatement(query))
        {
            preparedStatement.setString(1,userId);
            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next())
            {
                // You can retrieve the password if needed
                String password = resultSet.getString("pan_id");
                if(password.equals(panID))
                {
                    return true;
                }
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
        return false;
    }

    public boolean verifyingEmailAddress(String userId,String gmail)
    {
        String query = "SELECT email FROM users WHERE aadhar = ?";
        try(Connection connection = databaseDAO.getConnection();
            PreparedStatement preparedStatement =connection.prepareStatement(query))
        {
            preparedStatement.setString(1,userId);
            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next())
            {
                // You can retrieve the password if needed
                String password = resultSet.getString("email");
                if(password.equals(gmail))
                {
                    return true;
                }
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
        return false;
    }


    public boolean verifyingPaymentPassword(String userId,String passwords)
    {
        String query = "SELECT payment_password FROM users WHERE aadhar = ?";
        try(Connection connection = databaseDAO.getConnection();
            PreparedStatement preparedStatement =connection.prepareStatement(query))
        {
            preparedStatement.setString(1,userId);
            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next())
            {
                // You can retrieve the password if needed
                String password = resultSet.getString("payment_password");
                if(password.equals(passwords))
                {
                    return true;
                }
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
        return false;
    }

    public void updatingFailedPaymentNotificationRepo(String userID,String title,String msg)
    {
        String query = "INSERT INTO notifications (userId, title, message, status) VALUES (?,?,?,'UNREAD')";

        try(Connection connection = databaseDAO.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(query))
        {
            preparedStatement.setString(1,userID);
            preparedStatement.setString(2,title);
            preparedStatement.setString(3,msg);
            int rowsInserted = preparedStatement.executeUpdate();
            if (rowsInserted > 0)
            {
                System.out.println("DB UPDATED");
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
    }


    public boolean isRecieverThereRepo(String userID)
    {
        String query = "SELECT * FROM users WHERE aadhar = ?";
        try(Connection connection = databaseDAO.getConnection();
            PreparedStatement preparedStatement =connection.prepareStatement(query))
        {
            preparedStatement.setString(1,userID);
            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next())
            {
                return true;
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
        return false;
    }

    public String isRecieverActiveRepo(String userID)
    {
        String query = "SELECT status FROM users WHERE aadhar = ?";
        try(Connection connection = databaseDAO.getConnection();
            PreparedStatement preparedStatement =connection.prepareStatement(query))
        {
            preparedStatement.setString(1,userID);
            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next())
            {
                return resultSet.getString("status");
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
        return "Error";
    }

    public boolean decutingMONEYrepo(String userId,String app_id,String amount)
    {
        String query = "UPDATE ug_loan_applications SET loan_amount = ? WHERE user_id =? AND application_id = ?";
        try(Connection connection = databaseDAO.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(query))
        {
            preparedStatement.setString(1,amount);
            preparedStatement.setString(2,userId);
            preparedStatement.setString(3,app_id);

            int affected = preparedStatement.executeUpdate();
            if(affected>0)
            {
                return true;
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
        return false;
    }


    public String CurrentUserActualBalanceRepo(String userId,String app_id)
    {
        String query = "SELECT loan_amount FROM ug_loan_applications WHERE user_id = ? AND application_id = ?";

        try(Connection connection = databaseDAO.getConnection();
            PreparedStatement ps = connection.prepareStatement(query))
        {
            ps.setString(1,userId);
            ps.setString(2,app_id);
            ResultSet rs = ps.executeQuery();
            if(rs.next())
            {
                return rs.getString("loan_amount");
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
        return "not found";
    }

    public boolean Setting_0_toLoanifPossibleRepo(String userId,String app_id,String status)
    {
        String query = "UPDATE ug_loan_applications SET status = ? WHERE user_id =? AND application_id = ?";
        try(Connection connection = databaseDAO.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(query))
        {
            preparedStatement.setString(1,status);
            preparedStatement.setString(2,userId);
            preparedStatement.setString(3,app_id);

            int affected = preparedStatement.executeUpdate();
            if(affected>0)
            {
                return true;
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
        return false;
    }
}
