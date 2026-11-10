using System.Data.Common;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace RogAdmin.Infrastructure.Persistence;

/// <summary>
/// Tối ưu hóa SQLite ở cấp độ kết nối:
/// - WAL journal mode (đọc ghi đồng thời không khóa)
/// - synchronous = NORMAL (tăng tốc độ commit, an toàn trước crash)
/// - cache_size = -64000 (cấp phát 64MB RAM cache cho SQLite)
/// - temp_store = MEMORY (lưu bảng tạm và buffer sắp xếp trong RAM)
/// - mmap_size = 268435456 (256MB memory mapped I/O đọc trực tiếp từ kernel cache)
/// - busy_timeout = 5000 (chờ 5 giây khi có xung đột ghi thay vì báo lỗi tức thì)
/// </summary>
public class SqlitePragmaInterceptor : DbConnectionInterceptor
{
    private const string PragmaCommands = @"
        PRAGMA journal_mode = WAL;
        PRAGMA synchronous = NORMAL;
        PRAGMA cache_size = -64000;
        PRAGMA temp_store = MEMORY;
        PRAGMA mmap_size = 268435456;
        PRAGMA busy_timeout = 5000;
    ";

    public override void ConnectionOpened(DbConnection connection, ConnectionEndEventData eventData)
    {
        using var cmd = connection.CreateCommand();
        cmd.CommandText = PragmaCommands;
        cmd.ExecuteNonQuery();
        base.ConnectionOpened(connection, eventData);
    }

    public override async Task ConnectionOpenedAsync(DbConnection connection, ConnectionEndEventData eventData, CancellationToken cancellationToken = default)
    {
        using var cmd = connection.CreateCommand();
        cmd.CommandText = PragmaCommands;
        await cmd.ExecuteNonQueryAsync(cancellationToken);
        await base.ConnectionOpenedAsync(connection, eventData, cancellationToken);
    }
}
