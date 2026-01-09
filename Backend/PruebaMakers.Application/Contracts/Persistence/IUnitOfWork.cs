namespace PruebaMakers.Application.Contracts.Persistence;

public interface IUnitOfWork
{
    Task Rollback();
    Task Commit();
}