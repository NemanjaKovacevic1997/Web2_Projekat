﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravellifeChaser.Data;
using TravellifeChaser.Helpers;
using TravellifeChaser.Helpers.Repositories;
using TravellifeChaser.Models;

namespace TravellifeChaser.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FrendshipRequestsController : ControllerBase
    {
        private FriendshipRequestRepository repository;
        private IRepository<Friendship> frendshipRepository;
        public FrendshipRequestsController(FriendshipRequestRepository repository, IRepository<Friendship> frendshipRepository)
        {
            this.repository = repository;
            this.frendshipRepository = frendshipRepository;
        }

        // GET: api/FrendshipRequests
        [HttpGet]
        public ActionResult<IEnumerable<FriendshipRequest>> GetFrendshipRequests()
        {
            return repository.GetAll().ToList();
        }

        // GET: api/FrendshipRequests/5
        [HttpGet("{id}")]
        public ActionResult<FriendshipRequest> GetFrendshipRequest(int id)
        {
            var frendshipRequest = repository.Get(id);

            if (frendshipRequest == null)
                return NotFound();

            return frendshipRequest;
        }

        // PUT: api/FrendshipRequests/5
        [HttpPut("{id}")]
        public IActionResult PutFrendshipRequest(int id, FriendshipRequest frendshipRequest)
        {
            if (id != frendshipRequest.Id)
                return BadRequest();

            try
            {
                repository.Update(frendshipRequest);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FrendshipRequestExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/FrendshipRequests
        [HttpPost]
        public ActionResult<FriendshipRequest> PostFrendshipRequest(FriendshipRequest frendshipRequest)
        {
            try
            {
                repository.Add(frendshipRequest);
            }
            catch (DbUpdateException)
            {
                if (FrendshipRequestExists(frendshipRequest.Id))
                    return Conflict();
                else
                    throw;
            }
            return repository.Get(frendshipRequest.Id);
        }

        // DELETE: api/FrendshipRequests/5
        [HttpDelete("{id}")]
        public ActionResult<FriendshipRequest> DeleteFrendshipRequest(int id)
        {
            var frendshipRequest = repository.Get(id);
            if (frendshipRequest == null)
                return NotFound();

            repository.Remove(frendshipRequest);
            return frendshipRequest;
        }

        [HttpGet("accept/{id}")]
        public IActionResult AcceptFrendshipRequest(int id)
        {
            var frendshipRequest = repository.Get(id);
            if (frendshipRequest == null)
                return NotFound();

            Friendship newFrendship = new Friendship() { User1Id = frendshipRequest.FromId, User2Id = frendshipRequest.ToId };
            frendshipRepository.Add(newFrendship);
            repository.Remove(frendshipRequest);

            return Ok();
        }

        [HttpGet("refuse/{id}")]
        public IActionResult RefuseFrendshipRequest(int id)
        {
            var frendshipRequest = repository.Get(id);
            if (frendshipRequest == null)
                return NotFound();

            repository.Remove(frendshipRequest);
            return Ok();
        }

        private bool FrendshipRequestExists(int id)
        {
            return repository.Any(e => e.Id == id);
        }
    }
}