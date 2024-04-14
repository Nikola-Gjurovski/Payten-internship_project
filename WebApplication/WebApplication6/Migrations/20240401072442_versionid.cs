using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication6.Migrations
{
    /// <inheritdoc />
    public partial class versionid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Version_Project_ProjectId",
                table: "Version");

            migrationBuilder.DropIndex(
                name: "IX_Version_ProjectId",
                table: "Version");

            migrationBuilder.DropColumn(
                name: "name",
                table: "Version");

            migrationBuilder.AlterColumn<string>(
                name: "ProjectId",
                table: "Version",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ProjectId",
                table: "Version",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "Version",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Version_ProjectId",
                table: "Version",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Version_Project_ProjectId",
                table: "Version",
                column: "ProjectId",
                principalTable: "Project",
                principalColumn: "Id");
        }
    }
}
