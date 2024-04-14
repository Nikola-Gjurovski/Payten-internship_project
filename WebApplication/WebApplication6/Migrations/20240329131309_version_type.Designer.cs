﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WebApplication6.Data;

#nullable disable

namespace WebApplication6.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20240329131309_version_type")]
    partial class version_type
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.16")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("WebApplication6.Models.Project", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<bool?>("IsActive")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Project");
                });

            modelBuilder.Entity("WebApplication6.Models.VersionP", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Changes")
                        .HasColumnType("longtext");

                    b.Property<bool?>("IsActive")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("ProjectId")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("version_type")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.ToTable("Version");
                });

            modelBuilder.Entity("WebApplication6.Models.VersionP", b =>
                {
                    b.HasOne("WebApplication6.Models.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId");

                    b.Navigation("Project");
                });
#pragma warning restore 612, 618
        }
    }
}